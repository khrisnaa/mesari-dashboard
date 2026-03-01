import { SubmitButton } from '@/components/buttons/submit-button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customization } from '@/types/customization';
import { useForm } from '@inertiajs/react';

const Edit = ({ customization }: { customization: Customization }) => {
    const { data, setData, post, processing } = useForm({
        additional_price: customization.additional_price,
        // is_draft: customization.is_draft,
        _method: 'put',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/customizations/${customization.id}`);
    };

    return (
        <form onSubmit={submit} className="container mx-auto space-y-6 p-8">
            <PageHeader
                title="Update Customization"
                description="Review design and set final pricing."
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pricing & Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Additional Price (IDR)</Label>
                            <Input
                                type="number"
                                value={data.additional_price}
                                onChange={(e) =>
                                    setData('additional_price', Number(e.target.value))
                                }
                            />
                        </div>
                        {/* <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label>Production Ready</Label>
                                <p className="text-xs text-muted-foreground">
                                    Turn off 'Draft' to allow customer to checkout.
                                </p>
                            </div>
                            <Switch
                                checked={!data.is_draft}
                                onCheckedChange={(val) => setData('is_draft', !val)}
                            />
                        </div> */}
                    </CardContent>
                </Card>

                {/* Summary Info Sidebar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            Total Sides: <strong>{customization.total_custom_sides}</strong>
                        </p>
                        <p>
                            Product: <strong>{customization.product?.name}</strong>
                        </p>
                    </CardContent>
                </Card>
            </div>
            <SubmitButton processing={processing}>Save Changes</SubmitButton>
        </form>
    );
};
export default Edit;
